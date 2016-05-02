require 'feature_helper'

describe 'Click link' do
  each_adapter do
    scenario 'Click link' do
      visit 'click-link.html'
      find('span', text: 'Turn On').click
      expect(page).to have_css '.list-group-item-warning', text: 'Turn On'
    end
  end
end
