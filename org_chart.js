var getId = function() {
    return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001); 
};

var getHierarchyCode = function(node, oc) {
    let cur_node = node;
    let id = [];
    if (!oc.getNodeState(cur_node, 'parent').exist) {
        return '0';
    }

    let parent = '';
    let siblings = '';
    while (oc.getNodeState(cur_node, 'parent').exist) {
        parent = oc.getRelatedNodes(cur_node, 'parent');
        siblings = oc.getRelatedNodes(parent, 'children');
        
        for (let i = 0; i < siblings.length; i++) {
            let s_node = siblings[i];
            // console.log($(s_node);
            if ($(cur_node).attr('id') == $(s_node).attr('id')) {
                id.unshift(i);
            }
        }

        cur_node = parent;
    }


    id.unshift('0');

    node.val('h-code', id.join(''));
    return id.join('');
};

export function init_orgchart(ds, id) {
    console.log("init_orgchart: " + id);
    var oc = $(id).orgchart({
        'data': ds,
        'depth': 2,
        'nodeContent': 'title',
        'pan': true,
        'zoom': true,
        'createNode': function(node, data) {
            node[0].id = getId();
        }
    });

    $('.node').on('click', function () {
        // find the current graph 
        var $this = $(this);
        $('#selected-node').val($this.find('.title').text()).data('node', $this);
    });

    oc.$chartContainer.on('touchmove', function (event) {
        event.preventDefault();
    });

    oc.$chartContainer.on('click', '.orgchart', function(event) {
        if (!$(event.target).closest('.node').length) {
            $('#selected-node').val('');
            $('#selected-node-hierarchy-code').val('');
        }
    });

    oc.$chartContainer.on('click', '.node', function() {
        var $this = $(this);
        $('#selected-node').val($this.find('.title').text()).data('node', $this);
        // var parent =  oc.getRelatedNodes($this, 'parent');
        $('#selected-node-hierarchy-code').val(getHierarchyCode($this, oc));
    });

    return oc;
};

var getCurrentChart = function() {
    let active_li = $('.tab-menu li.active');
    let index = $('.tab-menu li').index(active_li);
    console.log(index);
    return index;
};


$(document).ready(function() {

    var ds = {
        'name': 'root',
        'relationship': '000',
    };

    var oc = init_orgchart(ds, '#cc0');
   
    $('input[name="chart-state"]').on('click', function() {
        $('.orgchart').toggleClass('edit-state', this.value !== 'view');
        $('#edit-panel').toggleClass('hidden', this.value === 'view');
        if ($(this).val() === 'edit') {
            $('.orgchart').find('tr').removeClass('hidden')
                .find('td').removeClass('hidden')
                .find('.node').removeClass('slide-up slide-down slide-right slide-left');
        } else {
            $('#btn-reset').trigger('click');
        }
    });

    $('input[name="node-type"]').on('click', function() {
        var $this = $(this);
        if ($this.val() === 'parent') {
            $('#edit-panel').addClass('edit-parent-node');
            $('#new-nodelist').children(':gt(0)').remove();
        } else {
            $('#edit-panel').removeClass('edit-parent-node');
        }
    });

    $('#btn-add-input').on('click', function() {
        $('#new-nodelist').append('<li><input type="text" class="new-node"></li>');
    });

    $('#btn-remove-input').on('click', function() {
        var inputs = $('#new-nodelist').children('li');
        if (inputs.length > 1) {
            inputs.last().remove();
        }
    });


    var editAttrbNode = '';

    $('#btn-add-nodes').on('click', function(e) {
        // get current chart
        let index = getCurrentChart();
        var $chartContainer = $('#cc'+ index);
        
        var nodeVals = [];
        $('#new-nodelist').find('.new-node').each(function(index, item) {
            var validVal = item.value.trim();
            if (validVal.length) {
                nodeVals.push(validVal);
            }
        });

        var $node = $('#selected-node').data('node');
        if (!nodeVals.length) {
            alert('Please input value for new node');
            return;
        }

        var nodeType = $('input[name="node-type"]:checked');
        if (!nodeType.length) {
            alert('Please select a node type');
            return;
        }

        if (nodeType.val() !== 'parent' && !$('.orgchart').length) {
            alert('Please create the root node first');
            return;
        }

        if (nodeType.val() !== 'parent' && !$node) {
            alert('Pleasae select one node in orgchart');
            return;
        }

        if (nodeType.val() === 'parent') {
            if (!$chartContainer.children('.orgchart').length) {
                oc = $chartContainer.orgchart({
                    'data': {'name' : nodeVals[0] },
                    'createNode': function($node, data) {
                        $node[0].id = getId();
                    }
                });
                oc.$chart.addClass('view-state');
            } else {
                oc.addParent($chartContainer.find('.node:first'), { 'name' : nodeVals[0], 'id' : getId() });
            }
        } else if (nodeType.val() === 'siblings') {
            if ($node[0].id === oc.$chart.find('.node:first')[0].id) {
                alert('You are not allowed to add sibling node to root node');
                return;
            }
            oc.addSiblings($node, nodeVals.map(function (item) {
                return { 'name': item, 'relationship': '110', 'id': getId() };
            }));
        } else {
            var hasChild = $node.parent().attr('colspan') > 0 ? true : false;
            if (!hasChild) {
                var rel = nodeVals.length > 1 ? '110' : '100';
                oc.addChildren($node, nodeVals.map(function(item) {
                    return { 'name': item, 'relationship': rel, 'id': getId()};
                }));
            } else {
                oc.addSiblings($node.closest('tr').siblings('.nodes').find('.node:first'), nodeVals.map(function(item) {
                    return { 'name': item, 'relationship': '110', 'id': getId() };
                }));
            }
        }

        $('#selected-node').val('');
        $('#new-nodelist').find('input:first').val('').parent().siblings().remove();

        $('.node').on('contextmenu', function(e) {
            e.preventDefault();
            editAttrbNode = $(this);
            var winWidth = $(document).width();
            var winHeight = $(document).height();

            var posX = e.pageX;
            var posY = e.pageY;

            var menuWidth = $('.contextmenu').width();
            var menuHeight = $('.contextmenu').height();

            var secMargin = 10;
            var posLeft = '';
            var posTop = '';

            if (posX + menuWidth + secMargin >= winWidth &&
                posY + menuHeight + secMargin >= winHeight) {
                    posLeft = posX - menuWidth - secMargin + 'px';
                    posTop = posY - menuHeight - secMargin + 'px';
                } 
            else if (posX + menuWidth + secMargin >= winWidth) {
                posLeft = posX + secMargin + 'px'; 
                posTop = posY + secMargin + 'px';
            }
            else if (posY + menuHeight + secMargin >= winHeight) {
                posLeft = posX + secMargin + 'px';
                posTop = posY - menuHeight - secMargin + 'px';
            } else {
                posLeft = posX + secMargin + 'px';
                posTop = posY + secMargin + 'px';
            }

            $('.contextmenu').css({
                "left": posLeft,
                "top" : posTop
            }).show();

            return false;
        });
        
        $('.contextmenu li a').click(function(e) {
            e.preventDefault();
            $(editAttrbNode).find('.title').text($(this).text()); 
            $(".contextmenu").hide();
        });

    });

    $('#btn-delete-nodes').on('click', function() {
        var $node = $('#selected-node').data('node');
        if (!$node) {
            alert('Please select one node in orgchart');
            return;
        } else if ($node[0] === $('.orgchart').find('.node:first')[0]) {
            if (!window.confirm('Are you sure you want to delete the whole chart?')) {
                return;
            }
        }
        oc.removeNodes($node);
        $('#selected-node').val('').data('node', null);
    });

    $('#btn-reset').on('click', function() {
        $('.orgchart').find('.focused').removeClass('focused');
        $('#selected-node').val('');
        $('#new-nodelist').find('input:first').val('').parent().siblings().remove();
        $('#node-type-panel').find('input').prop('checked', false);
    });

    $('#btn-get-hierarchy').on('click', function() {
        var hierarchy = oc.getHierarchy();
        console.log(hierarchy);
        console.log('DATA');
        console.log(oc);
    });

});
