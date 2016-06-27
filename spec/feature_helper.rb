require 'spec_helper'
require 'capybara'
require "capybara/rspec"
require "capybara/poltergeist"
require 'okay/test/application'
require 'timeout'

Capybara.default_driver = :poltergeist
Capybara.app = Okay::Test::Application
Capybara.server_port = 4000 + ENV['TEST_ENV_NUMBER'].to_i

RSpec.configure do |config|
  config.include Capybara::DSL

  config.example_status_persistence_file_path = 'tmp/rspec_status.log'

  config.around(:each) do |example|
    tries = 0
    begin
      example.run
      exception = example.example.exception
      if exception && tries < 10
        example.example.instance_variable_set(:@exception, nil)
        raise exception
      end
    rescue => e
      tries += 1
      # print "\nRetrying #{example.location} (Try ##{tries})...\n"
      retry
    end
  end
end

def wait_for(timeout: 10, condition: 'satisfy condition', &block)
  Timeout.timeout(timeout) { loop until yield }
rescue Timeout::Error => e
  raise "Timed out after #{timeout} seconds waiting for #{condition}."
end

def emit(state)
  evaluate_script('Okay.application.performWatchers([%s])' % state.to_json)
end

def set_adapter
  evaluate_script('Okay.application.setAdapter(Okay.jQuery)') if adapter == :jquery
  evaluate_script('Okay.application.timer.stop();') unless timer
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
  wait_for(condition: 'okay to load') { evaluate_script('typeof Okay.application') == 'object' }
  wait_for(condition: 'okay jquery to load') { evaluate_script('typeof Okay.jQuery') == 'object' }
  evaluate_script('Okay.log.DEBUG = false;')

  set_adapter
end
