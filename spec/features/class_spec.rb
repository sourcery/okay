require 'feature_helper'

describe 'Class' do
  each_adapter do
    scenario 'Manipulate classes' do
      visit '/class.html'
      expect(page).to have_content 'The div is not hidden.'
      emit("classExample:hidden" => true)
      expect(page).to have_css '#watcher.hidden', visible: false
    end
  end
end
