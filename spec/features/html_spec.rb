require 'feature_helper'

describe 'Html' do
  each_adapter do
    scenario 'Replace html' do
      visit '/html.html'
      expect(page).to have_content 'This div in its original state.'
      emit("htmlExample:content" => 'New HTML injected')
      expect(page).to have_content 'New HTML injected'
    end

    scenario 'Append html' do
      visit '/append-html.html'
      expect(page).to have_content 'This div in its original state.'
      emit("appendExample:content" => ' New HTML injected')
      expect(page).to have_content 'This div in its original state. New HTML injected'
    end

    scenario 'Prepend html' do
      visit '/prepend-html.html'
      expect(page).to have_content 'This div in its original state.'
      emit("prependExample:content" => 'New HTML injected. ')
      expect(page).to have_content 'New HTML injected. This div in its original state.'
    end
  end
end
