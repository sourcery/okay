require 'feature_helper'

describe 'Checkboxes' do
  scenario 'check/uncheck' do
    visit '/check-uncheck.html'
    expect(page).to have_content 'Hidden if checked'
    expect(page).to_not have_content 'Hidden if unchecked'
    check 'Hide'
    expect(page).to_not have_content 'Hidden if checked'
    expect(page).to have_content 'Hidden if unchecked'
    expect(find_field('Reason', disabled: true)).to be_disabled
    uncheck 'Hide'
    expect(page).to have_content 'Hidden if checked'
    expect(page).to_not have_content 'Hidden if unchecked'
    expect(find_field('Reason')).to_not be_disabled
  end
end
