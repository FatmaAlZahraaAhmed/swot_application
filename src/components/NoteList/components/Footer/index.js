import { h } from 'preact';

import { splitClasses } from 'utils/className';

import style from './style';
import ListType from '../ListType';
import AddButton from '../AddButton';
import DeleteButton from '../DeleteButton';

const Footer = ({
    isMinimized,
    type,
    addNewNote,
    requestDeleteAllNotes,
    isNoteListEmpty
}) => {
    const classes = [style.footer];
    if (isMinimized) {
        classes.push(style.footer_minimized);
    }

    return (
        <div className={splitClasses(classes)}>
            <ListType type={type} />
            <div className={style['footer__button-block']}>
                <AddButton
                    className={style['footer__button']}
                    type={type}
                    onClick={addNewNote}
                />
                <DeleteButton
                    className={style['footer__button']}
                    type={type}
                    onClick={requestDeleteAllNotes}
                    disabled={isNoteListEmpty}
                />
            </div>
        </div>
    );
};

export default Footer;
