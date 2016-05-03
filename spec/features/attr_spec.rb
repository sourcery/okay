require 'feature_helper'

describe 'Attr' do
  each_adapter do
    scenario 'Manipulate attributes' do
      visit '/attr.html'
      wait_for_okay
      expect(page).to have_content 'This div has no title.'
      emit(info: "This is a great title")
      expect(find('#watcher')['title']).to eq 'This is a great title'
    end
  end
end
