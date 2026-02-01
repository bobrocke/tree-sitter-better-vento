module.exports = grammar({
  name: "vento",
  externals: ($) => [$._code, $._front_matter_content],
  extras: ($) => [/\s/],
  rules: {
    template: ($) =>
      seq(optional(prec(10, $.front_matter)), repeat(choice($.content, $.tag))),

    content: () => prec.right(repeat1(/[^\{]+|\{/)),

    tag: ($) =>
      seq(
        choice("{{", "{{-"),
        optional($._expression),
        optional($.filter),
        choice("}}", "-}}"),
      ),

    front_matter: ($) =>
      prec(
        10,
        seq(
          token(prec(10, "---")),
          alias($._front_matter_content, $.front_matter_content),
          token(prec(10, "---")),
        ),
      ),

    _expression: ($) =>
      choice(
        // "Solo keywords" are just code blocks
        alias($.code_snippet, $.code),
        alias($.keyword, $.code),
        alias($.close_keyword, $.keyword),
        seq($.keyword, alias($._code, $.code)),
        $.comment,
      ),

    filter: ($) => repeat1(seq("|>", alias($._code, $.code))),

    // Vento keywords
    keyword: () =>
      /if|else|for|from|of|include|set|import|export|layout|function|echo|slot|default/,

    code_snippet: ($) => seq(/[a-zA-Z>\.\(\)\!_\?]/, $._code),

    close_keyword: () =>
      /\/(if|for|include|set|import|export|layout|function|echo|slot|default)/,

    comment: () => /#[^#]+#/,
  },
});
