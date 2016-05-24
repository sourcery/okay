require 'pathname'

module Okay
  module Test
    Application = Rack::Builder.app do
      public_folder = Pathname(File.dirname(__FILE__)).join('public')
      files = `ls #{public_folder}`.split("\n")
      files_list = files.map do |file|
        "<li><a href='#{file}'>#{file}</a></li>"
      end.join("\n")
      public_folder.join('index.html').write("<ul>#{files_list}</ul>")
      use Rack::Static, urls: [''], root: public_folder, index: 'index.html'
      run -> (env) { [200, { 'Content-Type' => 'text/javascript' }, ['OK']] }
    end
  end
end
