import { defineComponent } from "vue";

export default defineComponent({
  props: {
    row: Object as any,
    column: {
      type:Object,
      required:true,
    },
    index: Number,
  },
  setup (props) {
    return () => [
      props.column['show-overflow-tooltip']&&
      <span style={{'overflow': 'hidden','text-overflow':'ellipsis','white-space': 'nowrap',width:props.column.width||'200px'}}>
        {props.column!.format ? props.column!.format(props.row) : (props.row![props.column!.prop]||'--')}
      </span>,
      !props.column['show-overflow-tooltip']&&
      <div>
        {props.column!.render ? props.column!.render.call(this,{ row: props.row, column: props.column, $index: props.index })
          : (props.column!.format ? props.column!.format(props.row) : (props.row![props.column!.prop]||'--'))
        }
      </div>,
    ];
  },
});
