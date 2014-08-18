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
 * Interface for editing the navigation
 */

function NavigationMap(){}

//dependencies
var SectionService = pb.SectionService;

//inheritance
util.inherits(NavigationMap, pb.BaseController);

//statics
var SUB_NAV_KEY = 'navigation_map';

NavigationMap.prototype.render = function(cb) {
	var self = this;
	var dao  = new pb.DAO();
	dao.query('section', pb.DAO.ANYWHERE).then(function(sections) {

		//when no sections exist redirect to create page
        if(sections.length === 0) {
            self.redirect('/admin/content/navigation/new_item', cb);
            return;
        }

        pb.settings.get('section_map', function(err, sectionMap) {
            if(sectionMap === null) {
            	self.redirect('/admin/content/navigation/new_item', cb);
                return;
            }

            var angularData = pb.js.getAngularController(
                {
                    navigation: pb.AdminNavigation.get(self.session, ['content', 'sections'], self.ls),
                    pills: pb.AdminSubnavService.get(SUB_NAV_KEY, self.ls, SUB_NAV_KEY),
                    sections: NavigationMap.getOrderedSections(sections, sectionMap),
                    icons: {
                        container: 'inbox',
                        section: 'th-large',
                        article: 'files-o',
                        page: 'file-o',
                        link: 'link'
                    }
                }
            );

            self.setPageName(self.ls.get('NAV_MAP'));
            self.ts.registerLocal('angular_script', angularData);
	        self.ts.load('admin/content/navigation/map', function(err, data) {
                var result = '' + data;
                cb({content: result});
            });
        });
    });
};

NavigationMap.getOrderedSections = function(sections, sectionMap) {
	for(var i = 0; i < sections.length; i++) {
		for(var j = 0; j < sectionMap.length; j++) {
			var sectionMatch = false;
			if(sectionMap[j].children) {
				for(var s = 0; s < sectionMap[j].children.length; s++) {
					if(sectionMap[j].children[s].children) {
						for(var n = 0; n < sectionMap[j].children[s].children.length; n++) {
							if(sectionMap[j].children[s].children[n].uid === sections[i]._id.toString()) {
								sectionMap[j].children[s].children[n] = sections[i];
								sectionMatch = true;
								break;
							}
						}
					}
					if(sectionMatch) {
						break;
					}
					if(sectionMap[j].children[s].uid === sections[i]._id.toString()) {
						sections[i].children = sectionMap[j].children[s].children;
						sectionMap[j].children[s] = sections[i];
						sectionMatch = true;
						break;
					}
				}
			}
			if(sectionMatch) {
				break;
			}
			if(sectionMap[j].uid === sections[i]._id.toString()) {
				sections[i].children = sectionMap[j].children;
				sectionMap[j] = sections[i];
				sectionMatch = true;
				break;
			}
		}
	}

	return sectionMap;
};

NavigationMap.getSubNavItems = function(key, ls, data) {
	var pills = SectionService.getPillNavOptions();
	pills.unshift(
    {
        name: SUB_NAV_KEY,
        title: ls.get('NAV_MAP'),
        icon: 'refresh',
        href: '/admin/content/navigation/map'
    });
    return pills;
};

//register admin sub-nav
pb.AdminSubnavService.registerFor(SUB_NAV_KEY, NavigationMap.getSubNavItems);

//exports
module.exports = NavigationMap;
