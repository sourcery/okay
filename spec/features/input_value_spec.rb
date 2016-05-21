require 'feature_helper'

describe 'Input value' do
  def window_location_hash
    page.evaluate_script('window.location.hash')
  end

  each_adapter do
    scenario 'Sync a field and a span' do
      visit '/input_value.html'
      wait_for_okay
      expect(page).to have_content 'You entered: (enter some text above)'
      fill_in 'What do you say?', with: 'Really interesting content'
      wait_for { page.has_content? 'You entered: Really interesting content' }
    end
  end
end
