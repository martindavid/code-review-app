import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';

import UserStatus from '../UserStatus';


describe('When authenticated', () => {
  test('UserStatus render properly', () => {
    const component = (
        <UserStatus isAuthenticated={true} />
    );
    const wrapper = shallow(component);
    const element = wrapper.find('li');
    expect(element.length).toBe(3);
    expect(element.get(0).props.children[0].props.children).toBe('User ID: ');
  });

  test('UserStatus render a snapshot properly', () => {
    const component = (
      <Router>
        <UserStatus isAuthenticated={true} />
      </Router>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('When not authenticated', () => {
  test('UserStatus render properly', () => {
    const wrapper = shallow(<UserStatus isAuthenticated={false} />);
    const element = wrapper.find('p');
    expect(element.length).toBe(1);
  expect(element.get(0).props.children[0]).toContain('You must be logged in to view this.');
  });
  
  test('UserStatus render a snapshot properly', () => {
    const component = (
      <Router>
        <UserStatus isAuthenticated={false} />
      </Router>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
})
