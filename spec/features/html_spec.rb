require 'feature_helper'

describe 'Html' do
  scenario 'Manipulate html' do
    visit '/html.html'
    expect(page).to have_content 'This div in its original state.'
    emit(content: 'New HTML injected')
    expect(page).to have_content 'New HTML injected'
  end
end
