require 'feature_helper'

describe 'Select' do
  each_adapter do
    scenario 'Select different options' do
      visit '/select.html'
      select 'Hamburger', from: 'Entree'
      check 'Would you like fries with that?'
      select 'Fries Only', from: 'Entree'
      expect(find_field('Would you like fries with that?', visible: false, disabled: true)).to be_disabled
      select 'Grilled Cheese', from: 'Entree'
      uncheck 'Would you like fries with that?'
      select '-- Choose --', from: 'Entree'
      expect(find_field('Would you like fries with that?', visible: false, disabled: true)).to be_disabled
    end
  end
end
