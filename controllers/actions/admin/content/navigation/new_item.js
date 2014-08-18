/*
    Copyright (C) 2014  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Creates a new section
 */


//dependencies
var EditSectionPostController = require('./edit_item.js');

function NewNavItemPostController(){}

//inheritance
util.inherits(NewNavItemPostController, EditSectionPostController);


NewNavItemPostController.prototype.getObject = function(post, cb) {
	var navItem = pb.DocumentCreator.create('section', post, ['keywords'], ['parent']);
	cb(null, navItem);
};

NewNavItemPostController.prototype.getSuccessMessage = function(navItem) {
	return navItem.name + ' ' + this.ls.get('CREATED');
};

NewNavItemPostController.prototype.getFormLocation = function() {
	return '/admin/content/navigation/new_item';
};

//exports
module.exports = NewNavItemPostController;
