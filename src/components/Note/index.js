import { h } from 'preact';
import { PureComponent } from 'preact-compat';
import { DragSource, DropTarget } from 'preact-dnd';

import { ItemTypes } from 'constants/dnd';
import { splitClasses } from 'utils/className';

import style from './style';
import EditableView from './components/EditableView';
import ReadOnlyView from './components/ReadOnlyView';

class Note extends PureComponent {
    deleteNote = () => {
        this.props.deleteNote(this.props.listType, this.props.note.id);
    };

    activateNote = () => {
        this.props.setNoteActive(this.props.listType, this.props.note.id, true);
    };

    deactivateNote = () => {
        this.props.setNoteActive(
            this.props.listType,
            this.props.note.id,
            false
        );
    };

    setNoteText = event => {
        this.props.setNoteText(
            this.props.listType,
            this.props.note.id,
            event.target.value
        );
    };

    getNoteClasses = isDragging => {
        let noteClasses = [style.note];
        if (isDragging) {
            noteClasses = [style.note, style.note_dragging];
        }

        return splitClasses(noteClasses);
    };

    renderEditableView = () => (
        <EditableView
            listType={this.props.listType}
            deactivateNote={this.deactivateNote}
            onChange={this.setNoteText}
            text={this.props.note.text}
        />
    );

    renderReadOnlyView = () => (
        <ReadOnlyView
            listType={this.props.listType}
            activateNote={this.activateNote}
            deleteNote={this.deleteNote}
        >
            {this.props.note.text}
        </ReadOnlyView>
    );

    renderNoteView = () => {
        if (this.props.note.isBeingEdited) {
            return this.renderEditableView();
        }

        return this.renderReadOnlyView();
    };

    render({ isDragging }) {
        return this.props.connectDragSource(
            this.props.connectDropTarget(
                <div className={this.getNoteClasses(isDragging)}>
                    {this.props.connectDragPreview(
                        <div>{this.renderNoteView()}</div>
                    )}
                </div>
            )
        );
    }
}

const target = {
    hover(props, monitor) {
        const movingNote = monitor.getItem();
        if (movingNote.id === props.note.id) {
            return;
        }

        props.moveNote(
            movingNote.listType,
            movingNote.id,
            props.listType,
            props.index
        );

        /* note in "drag" state is not updated by itself,
         * so we change its listType manually */
        movingNote.listType = props.listType;
    }
};

const collectTarget = connect => ({
    connectDropTarget: connect.dropTarget()
});

const source = {
    beginDrag(props) {
        props.setNoteDragging(true);
        props.activateNoteList(props.listType);

        return {
            id: props.note.id,
            listType: props.listType,
            index: props.index
        };
    },
    canDrag(props) {
        return !props.note.isBeingEdited;
    },
    isDragging(props, monitor) {
        return props.note.id === monitor.getItem().id;
    },
    endDrag(props) {
        props.setNoteDragging(false);
    }
};

const collectSource = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
});

export default DropTarget(ItemTypes.NOTE, target, collectTarget)(
    DragSource(ItemTypes.NOTE, source, collectSource)(Note)
);
