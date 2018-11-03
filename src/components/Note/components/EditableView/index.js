import { h, Component } from 'preact';

import { splitClasses } from 'utils/className';

import style from '../../style';
import SaveButton from '../SaveButton';

export default class EditableNote extends Component {
    componentDidMount() {
        this.noteInput.focus();
    }

    onKeyDown = event => {
        if (
            (event.key === 'Enter' && event.ctrlKey) ||
            event.key === 'Escape'
        ) {
            this.props.deactivateNote();
        }
    };

    onBlur = event => {
        if (!event.target.value) {
            this.props.deleteNote();
        } else {
            this.props.deactivateNote();
        }
    };

    render({ text, listType, deactivateNote, onChange }) {
        return (
            <div
                onKeyDown={this.onKeyDown}
                className={style['note__container']}
            >
                <textarea
                    className={splitClasses([
                        style[listType],
                        style.note__view,
                        style.note__view_editable
                    ])}
                    ref={input => (this.noteInput = input)}
                    onBlur={this.onBlur}
                    onChange={onChange}
                    value={text}
                />
                <SaveButton
                    className={style.note__button}
                    onClick={deactivateNote}
                />
            </div>
        );
    }
}
