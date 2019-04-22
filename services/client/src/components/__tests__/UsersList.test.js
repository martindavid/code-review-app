import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import UsersList from '../UsersList';

const users = [
  {
    'active': true,
    'admin': false,
    'email': 'mvalentino@martinlabs.me',
    'id': 1,
    'username': 'mvalentino',
  },
  {
    'active': true,
    'admin': false,
    'email': 'martin@gmail.com',
    'id': 2,
    'username': 'martin',
  }
];

test('UsersList render properly', () => {
  const wrapper = shallow(<UsersList users={users} />);
  const element = wrapper.find('h4');
  expect(wrapper.find('h1').get(0).props.children).toBe('All Users');

  // Table
  const table = wrapper.find('table');
  expect(table.length).toBe(1);
  // Table Head
  expect(wrapper.find('thead').length).toBe(1);
  const th = wrapper.find('th');
  expect(th.length).toBe(5);
  expect(th.get(0).props.children).toBe('ID');
  expect(th.get(1).props.children).toBe('Email');
  expect(th.get(2).props.children).toBe('Username');
  expect(th.get(3).props.children).toBe('Active');
  expect(th.get(4).props.children).toBe('Admin');

  // Table Body
  expect(wrapper.find('tbody').length).toBe(1)
  expect(wrapper.find('tbody > tr').length).toBe(2);
  const td = wrapper.find('tbody > tr > td');
  expect(td.length).toBe(10);
  expect(td.get(0).props.children).toBe(1);
  expect(td.get(1).props.children).toBe('mvalentino@martinlabs.me');
  expect(td.get(2).props.children).toBe('mvalentino');
  expect(td.get(3).props.children).toBe('true');
  expect(td.get(4).props.children).toBe('false');

})

test('UsersList renders a snapshot properly', () => {
  const tree = renderer.create(<UsersList users={users} />).toJSON();
  expect(tree).toMatchSnapshot();
})
