require 'spec_helper'
require 'capybara'
require "capybara/rspec"
require "capybara/poltergeist"
require 'okay/test/sinatra/application'
require 'timeout'

Capybara.default_driver = :poltergeist
Capybara.app = Okay::Test::Sinatra::Application

RSpec.configure do |config|
  config.include Capybara::DSL
end

def wait_for(timeout: 10, condition: 'satisfy condition', &block)
  Timeout.timeout(timeout) { loop until yield }
rescue Timeout::Error => e
  raise "Timed out after #{timeout} seconds waiting for #{condition}."
end

def emit(state)
  evaluate_script('Okay.emit(%s, Okay.watchers)' % state.to_json)
end

def set_adapter
  evaluate_script('Okay.jQuery.use();') if adapter == :jquery
  evaluate_script('Okay.timer.stop();') unless timer
end

def each_adapter(&block)
  [ :no, :jquery ].each do |adapter|
    context "with #{adapter} adapter" do
      let(:adapter) { adapter }

      context 'using the timer' do
        let(:timer) { true }
        instance_eval(&block)
      end

      context 'not using the timer' do
        let(:timer) { false }
        instance_eval(&block)
      end

    end
  end
end

def wait_for_okay
  wait_for(condition: 'okay to be available') { evaluate_script('typeof Okay') == 'object' }
  wait_for(condition: 'okay to load') { evaluate_script('typeof Okay.emit') == 'function' }
  wait_for(condition: 'okay jquery to load') { evaluate_script('typeof Okay.jQuery') == 'object' }

  set_adapter
end
