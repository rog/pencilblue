/*
    Copyright (C) 2015  PencilBlue, LLC

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

function showThumbnailModal()
{
    var thumb_btn = document.getElementById('thumb_btn');
    var article_id = thumb_btn.dataset.articleid;

    $('.add_layout_link').hide();
    $('.add_layout_media').show();
    $('#thumbnail_modal #layout_link_url').val('');
    $('#thumbnail_modal #thumbnail_media_options').html(getLayoutThumbnailOptions('thumbnail'));
    $('#thumbnail_modal').modal({backdrop: 'static', keyboard: true});
}

function getLayoutThumbnailOptions(wysId)
{
    var activeMedia = getActiveMedia();//$('#active_media .media_item');
    if(activeMedia.length === 0)
    {
        return '<button type="button" class="btn btn-sm btn-default" onclick="associateMedia(\'' + wysId + '\')">' + loc.wysiwyg.ASSOCIATE_MEDIA + '</button><br/>&nbsp;';
    }

    var mediaHTML = '';
    for(var i = 0; i < activeMedia.length; i++) {

            var mediaCheckbox = '<div class="radio"><label><input type="radio" id="^media_id^" data-name="^media_name^" >^media_name^</label></div>';
            mediaCheckbox = mediaCheckbox.split('^media_id^').join(activeMedia[i]._id.toString());
            mediaCheckbox = mediaCheckbox.split('^media_name^').join(activeMedia[i].name);

            mediaHTML = mediaHTML.concat(mediaCheckbox);
    }

    $('#layout_media_format').show();
    return mediaHTML;
}

function addThumbnailMedia()
{
    var associatedMedia = { id: '', name: '' };
    var mediaOptionsChecked = 0;
    $('#thumbnail_modal #thumbnail_media_options input').each(function()
    {
        if($(this).is(':checked'))
        {
            associatedMedia.id = $(this).attr('id');
            associatedMedia.name = $(this).data('name');
            return false;
        }
    });
    if( associatedMedia.id ) {
        console.log('TF='+associatedMedia.id);
        var tb_placeholder = document.getElementById('thumbnail_name');
        var tb_input = document.getElementById('thumbnail');
        tb_placeholder.value = associatedMedia.name;
        tb_input.value = associatedMedia.id;
        $("#thumbnail").trigger('input');
        $("#thumbnail_name").trigger('input');
        $('#thumbnail_modal').modal('hide');
    }
}
