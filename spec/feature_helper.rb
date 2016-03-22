require 'spec_helper'
require 'capybara'
require "capybara/rspec"
require "capybara/poltergeist"
require 'okay/test/sinatra/application'

Capybara.default_driver = :poltergeist
Capybara.app = Okay::Test::Sinatra::Application

RSpec.configure do |config|
  config.include Capybara::DSL
end

def emit(state)
  evaluate_script('Okay.emit(%s)' % state.to_json)
end