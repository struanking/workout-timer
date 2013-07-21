BW.Module.AllHRCases.prototype.attachments = (function () {
            var attachments = [];

            function add() {
                var attachmentsLen = attachments.length,
                    id,
                    file;

                if (attachmentsLen === 5) {
                    return;
                }

                id = attachmentsLen > 0 ? attachments[attachmentsLen - 1].id + 1 : 1,
                file = new File(id);
                file.add();
                j$(file.node).on('click', '.remove-file', function() {
                    file.remove();
                    allowAdd();
                });
                attachments.push(file);
            }

            function allowAdd() {
                var container = j$('#another-attachment').parent();
                if (attachments.length >= 5) {
                    container.hide(); // Remove listener too?
                    container.after('<p id="msg-more-attachments">More attachments to upload? Try combining two or more into one.</p>')
                } else {
                    container.show();
                    j$('#msg-more-attachments').remove();
                }
            }

            function File(id) {
                this.id = id;
                this.j$id = 'a' + id;
                this.name = 'attachment' + id;
                this.node = document.createElement('li');
                return this;
            }

            File.prototype.add = function() {
                var container = document.getElementById('attachments-list');
                if (container) {
                    this.render();
                    container.appendChild(this.node);
                }
            }

            File.prototype.remove = function() {
                var arrayPosition = attachments.indexOf(this);
                j$('#' + this.j$id).remove();
                if (arrayPosition > -1) {
                    attachments.splice(arrayPosition, 1);
                }
            }

            File.prototype.render = function() {
                var obj = this.node;
                obj.id = this.j$id;
                obj.className = 'frm-file';
                obj.innerHTML = '<span>' +
                    '<div class="js-file-field file-field">' +
                    '<span><a class="btn fg-white bg-grey66 fg-white-hover bg-black-hover" href="#" title="">' +
                    '<strong>Browse</strong>' +
                    '</a></span>' +
                    '<div class="file-value" data-file-types=""></div>' +
                    '<span><span>' +
                    '<input size="45" style="" type="file" name="' + this.name + '" id="' + this.name + '"/>' +
                    '</span></span>' +
                    '</div>' +
                    '<span></span>' +
                    '</span>' +
                    '<a class="btn remove-file" href="#"><span class="icn minus-black minus-white-hover"></span></a>';
                return true;
            }

            return {
                add: add,
                allowAdd: allowAdd
            }
        }());