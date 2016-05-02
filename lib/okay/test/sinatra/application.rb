require 'sinatra/base'
require 'pathname'

module Okay
  module Test
    module Sinatra
      class Application < ::Sinatra::Base
        helpers do
          def dist(resource)
            send_file Pathname(File.dirname(__FILE__)).join('..', '..', '..', '..', 'dist', "#{resource}.js").open
          end
        end

        get '/okay.js' do
          dist('okay')
        end

        get '/okay-jquery.js' do
          dist('okay-jquery')
        end
      end
    end
  end
end