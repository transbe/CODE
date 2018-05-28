/**
 * @author: gaohui
 * @date: 2017-06-20
 * @last modified by: gaohui
 * @last modified time: 2017-06-20 10:19:32 
 * @file:bootstrapTable扩展自定义验证规则
 */


(function($) {
    /*
     * 重写BootstrapValidator的onSort,getCaret方法
     * 
     * 重写的原因：
     *      sortName不是filed时，排序不生效
     * 解决的问题：
     *      解决了，自定义sortName排序问题
     * 
     */
    if ($.fn.bootstrapTable) {
        $.fn.bootstrapTable.Constructor.prototype.onSort = function (event) {
            var $this = event.type === "keypress" ? $(event.currentTarget) : $(event.currentTarget).parent(),
                $this_ = this.$header.find('th').eq($this.index());

            this.$header.add(this.$header_).find('span.order').remove();
            if (this.options.sortName === $this.data('field')) {
                this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                if($this.data('sortName') != undefined){
                    this.options.sortName = $this.data('sortName');
                    this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
                }else{
                    this.options.sortName = $this.data('field');
                    this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
                }
            }
            this.trigger('sort', this.options.sortName, this.options.sortOrder);

            $this.add($this_).data('order', this.options.sortOrder);

            // Assign the correct sortable arrow
            this.getCaret();

            if (this.options.sidePagination === 'server') {
                this.initServer(this.options.silentSort);
                return;
            }

            this.initSort();
            this.initBody();
        };
        $.fn.bootstrapTable.Constructor.prototype.getCaret = function () {
            var that = this;
           
            $.each(this.$header.find('th'), function (i, th) {
                if($(th).data('order') == 'desc'){
                     $(th).find('.sortable').removeClass('both');
                }
                if($(th).data('sortName') != undefined){
                    $(th).find('.sortable').removeClass('desc asc').addClass($(th).data('sortName') === that.options.sortName ? $(th).data('order')  : 'both');
                }else{
                    $(th).find('.sortable').removeClass('desc asc').addClass($(th).data('field') === that.options.sortName ? that.options.sortOrder : 'both');
                }
                if($(th).data('order') == 'desc'){
                     $(th).find('.sortable').removeClass('desc asc').addClass( $(th).data('order'));
                }
            });
        };
    }
   
}(window.jQuery));;