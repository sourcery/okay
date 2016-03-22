require 'sinatra/base'
require 'pathname'

module Okay
  module Test
    module Sinatra
      class Application < ::Sinatra::Base
        get '/okay.js' do
          send_file Pathname(File.dirname(__FILE__)).join('..', '..', '..', '..', 'src', 'okay.js').open
        end
      end
    end
  end
end