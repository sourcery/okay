require 'feature_helper'

describe 'Attr' do
  scenario 'Manipulate attributes' do
    visit '/attr.html'
    expect(page).to have_content 'This div has no title.'
    emit(info: "This is a great title")
    expect(find('#watcher')['title']).to eq 'This is a great title'
  end
end
