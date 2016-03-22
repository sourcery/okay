require 'spec_helper'
require 'capybara'
require "capybara/rspec"
require "capybara/poltergeist"
require 'okay/test/sinatra/application'

Capybara.default_driver = :poltergeist
Capybara.app = Okay::Test::Sinatra::Application

describe 'Class' do
  include Capybara::DSL

  scenario 'Manipulate classes' do
    visit '/class.html'
    expect(page).to have_content 'The div is not hidden.'
    evaluate_script('Okay.emit({ hidden: true });');
    expect(page).to have_css '#watcher.hidden', visible: false
  end
end
