((content) @injection.content
  (#set! injection.language "html")
  (#set! injection.combined))

((front_matter) @injection.content
  (#set! injection.language "yaml"))

((code) @injection.content
  (#set! injection.language "javascript"))
