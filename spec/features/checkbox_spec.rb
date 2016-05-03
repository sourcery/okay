require 'feature_helper'

describe 'Checkboxes' do
  def expect_unchecked_message
    wait_for { ! page.has_content? 'Checkbox is checked' }
    expect(page).to have_content 'Checkbox is unchecked'
    expect(find_field('Reason')).to_not be_disabled
  end

  def expect_checked_message
    wait_for { ! page.has_content? 'Checkbox is unchecked' }
    expect(page).to have_content 'Checkbox is checked'
    expect(find_field('Reason', visible: false, disabled: true)).to be_disabled
  end

  each_adapter do
    scenario 'check/uncheck' do
      visit '/check-uncheck.html'
      wait_for_okay
      expect_unchecked_message
      check 'Hide'
      expect_checked_message
      uncheck 'Hide'
      expect_unchecked_message
    end
  end
end
