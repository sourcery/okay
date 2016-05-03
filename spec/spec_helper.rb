$LOAD_PATH.unshift File.expand_path('../../lib', __FILE__)
require 'okay'

okay = Pathname(__dir__).join('..', 'dist', 'okay.js')
okay.unlink
`build`
sleep 0.1 until okay.file?
