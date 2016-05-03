require 'feature_helper'

describe 'Click link' do
  each_adapter do
    scenario 'Click link' do
      visit 'click-link.html'
      evaluate_script(<<-JS)
event = document.createEvent('MouseEvent').initMouseEvent('click', true, false);
turnOn.dispatchEvent(event);
JS
      expect(page).to have_css '.list-group-item-warning', text: 'Turn On'
    end
  end
end
