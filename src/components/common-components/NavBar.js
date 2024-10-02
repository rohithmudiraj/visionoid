import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler
} from 'reactstrap';
import SearchBar from './SearchBar';
import Settings from './Settings';

function Example(args) {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <>
      <div>
        <Navbar color="faded" light>
          <NavbarBrand className="me-auto">
            <SearchBar />
          </NavbarBrand>
          <NavbarBrand href="/" className="me-auto">
            visionoid
          </NavbarBrand>
          <NavbarToggler onClick={toggleNavbar} className="me-2" />
          <Collapse isOpen={!collapsed} navbar>
            <Settings />
          </Collapse>
        </Navbar>
      </div>
    </>
  );
}

export default Example;