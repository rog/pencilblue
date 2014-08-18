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
 * Interface for creating a navigation item
 */

function NewNavItem(){
	this.navItem = null;
}

//dependencies
var SectionService = pb.SectionService;

//inheritance
util.inherits(NewNavItem, pb.BaseController);

//statics
var SUB_NAV_KEY = 'new_section';

NewNavItem.prototype.render = function(cb) {
	var self = this;

	//gather all data
	this.gatherData(function(err, data) {
		if (util.isError(err)) {
			throw err;
		}
		else if(!data.section) {
			self.reqHandler.serve404();
			return;
		}

		self.navItem = data.section;
        var angularData = pb.js.getAngularController(data);
        self.ts.registerLocal('angular_script', angularData);
    	self.getTemplate(function(err, result) {
            cb({content: result});
        });
	});
};

NewNavItem.prototype.getTemplate = function(cb) {
	this.ts.registerLocal('content_type', '{{section.type}}');
	this.ts.registerLocal('selection_id_field', 'item');
    this.ts.registerLocal('content_search_value', '');
	this.ts.load('admin/content/navigation/new_item', cb);
};

NewNavItem.prototype.getPageName = function() {
	return this.ls.get('NEW_NAV_ITEM');
};

NewNavItem.prototype.gatherData = function(cb) {
	async.series(this.getDataTasks(), cb);
};

NewNavItem.prototype.getDataTasks = function() {
	var self = this;
	return {

		//get editors
		editors: function(callback) {
			pb.users.getEditorSelectList(self.session.authentication.user_id, callback);
		},

		//get parents
		parents: function(callback) {
			var sectionService = new pb.SectionService();
			sectionService.getParentSelectList(self.pathVars.id, callback);
		},

		//form tabs
		tabs: function(callback) {
			var tabs = [
	            {
	                active: 'active',
	                href: '#section_settings',
	                icon: 'cog',
	                title: self.ls.get('SETTINGS')
	            },
	            {
	                href: '#section_seo',
	                icon: 'tasks',
	                title: self.ls.get('SEO')
	            }
	        ];
			callback(null, tabs);
		},

		navigation: function(callback) {
			callback(null, pb.AdminNavigation.get(self.session, ['content', 'sections'], self.ls));
		},

		types: function(callback) {
			callback(null, SectionService.getTypes(self.ls));
		},

		section: function(callback) {
			var navItem;
			if (self.session.fieldValues) {
				navItem = self.session.fieldValues;
				if (util.isArray(navItem.keywords)) {
					navItem.keywords = navItem.keywords.join(',');
				}
				self.session.fieldValues = undefined;
				callback(null, navItem);
			}
			else {
				navItem = {
					type: 'container'
				};
				callback(null, navItem);
			}
		},

        //breadcrumbs
		pills: function(callback) {
			var pills = pb.AdminSubnavService.get(self.getSubnavKey(), self.ls, self.getSubnavKey(), self.navItem);
            callback(null, pills);
		},
	};
};

NewNavItem.prototype.getSubnavKey = function() {
    return SUB_NAV_KEY;
};

NewNavItem.getSubNavItems = function(key, ls, data) {
	var pills = SectionService.getPillNavOptions();
    pills.unshift(
    {
        name: 'manage_topics',
        title: ls.get('NEW_NAV_ITEM'),
        icon: 'chevron-left',
        href: '/admin/content/navigation/map'
    });
    return pills;
};

//register admin sub-nav
pb.AdminSubnavService.registerFor(SUB_NAV_KEY, NewNavItem.getSubNavItems);

//exports
module.exports = NewNavItem;
