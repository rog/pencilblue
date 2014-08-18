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
 * Interface for editing a navigation item
 */

function EditNavItem(){}

//dependencies
var AdminNavigation      = pb.AdminNavigation;
var SectionService       = pb.SectionService;
var NewItemController = require('./new_item.js');

//inheritance
util.inherits(EditNavItem, NewItemController);

//statics
var SUB_NAV_KEY = 'edit_nav_item';

EditNavItem.prototype.render = function(cb) {
	var self = this;
	var vars = this.pathVars;

	//make sure an ID was passed
    if(!vars.id) {
        this.reqHandler.serve404();
        return;
    }

    EditNavItem.super_.prototype.render.apply(self, [cb]);
};

EditNavItem.prototype.getPageName = function() {
	return this.ls.get('EDIT_NAVIGATION');
};

EditNavItem.prototype.getTemplate = function(cb) {
	var self = this;

	this.ts.registerLocal('section_id', this.pathVars.id);
	this.ts.registerLocal('content_type', '{{section.type}}');
	this.ts.registerLocal('selection_id_field', 'item');
	this.ts.registerLocal('content_search_value', function(flag, cb) {
    	if (self.navItem.item) {
    		var dao = new pb.DAO();
    		dao.loadById(self.navItem.item, self.navItem.type, function(err, content) {
    			cb(err, content ? content.headline : '');
    		});
    	}
    	else {
    		cb(null, '');
    	}
    });
	this.ts.load('admin/content/navigation/edit_item', cb);
};

EditNavItem.prototype.getSubnavKey = function() {
    return SUB_NAV_KEY;
};

EditNavItem.prototype.getDataTasks = function() {
	var self  = this;
	var tasks = EditNavItem.super_.prototype.getDataTasks.apply(self, []);
	tasks.section = function(callback) {
		if (self.session.fieldValues) {
			var navItem = self.session.fieldValues;
			if (util.isArray(navItem.keywords)) {
				navItem.keywords = navItem.keywords.join(',');
			}

            self.navItem = self.session.fieldValues;
            self.session.fieldValues = undefined;
			callback(null, navItem);
			return;
		}

		var dao = new pb.DAO();
	    dao.loadById(self.pathVars.id, 'section', function(err, navItem) {
	        if (navItem) {
                self.navItem = navItem;
	        	navItem.keywords = navItem.keywords.join(',');
	        }
	        callback(err, navItem);
	    });
	};
	return tasks;
};

EditNavItem.getSubNavItems = function(key, ls, data) {
	var pills = SectionService.getPillNavOptions();
    pills.unshift(
    {
        name: 'manage_topics',
        title: data.name,
        icon: 'chevron-left',
        href: '/admin/content/navigation/map'
    });
    return pills;
};

//register admin sub-nav
pb.AdminSubnavService.registerFor(SUB_NAV_KEY, EditNavItem.getSubNavItems);

//exports
module.exports = EditNavItem;
