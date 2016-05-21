require 'feature_helper'

describe 'Submit' do
  def window_location_hash
    page.evaluate_script('window.location.hash')
  end

  each_adapter do
    scenario 'Submit a form' do
      visit '/submit.html'
      wait_for_okay
      expect(window_location_hash).to eq ''
      check "Submit me!"
      wait_for { window_location_hash == '#submitted' }
      expect(window_location_hash).to eq '#submitted'

      fill_in 'Where do you want to go?', with: 'funplace'
      uncheck "Submit me!"
      expect(window_location_hash).to eq '#submitted'
      check "Submit me!"
      wait_for { window_location_hash == '#funplace' }
      expect(window_location_hash).to eq '#funplace'
    end
  end
end
