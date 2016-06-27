require 'feature_helper'

describe 'Keyup' do
  each_adapter do
    scenario 'Type into a form' do
      visit '/keyup.html'
      wait_for_okay
      field = find_field('Type something here:')
      field.send_keys('Faire du blablabla')
      expect(page).to have_content 'Shows up here: Faire du blablabla'
    end
  end
end
