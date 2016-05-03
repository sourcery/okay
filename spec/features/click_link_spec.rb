require 'feature_helper'

describe 'Click link' do
  each_adapter do
    scenario 'Click span within a link' do
      visit 'click-link.html'
      wait_for_okay

      # Click once to get the coordinates
      coordinates = click_on 'On'
      x = coordinates['position']['x']
      y = coordinates['position']['y']

      # Click off to reset
      click_on 'Off'
      wait_for(condition: 'button is off') { ! page.has_css?('.list-group-item-warning', text: 'On') }

      # Click right on that span.
      page.driver.browser.send(:click_coordinates, x + 18, y + 13)
      wait_for(condition: 'button is on') { page.has_css?('.list-group-item-warning', text: 'On') }
    end
  end
end
