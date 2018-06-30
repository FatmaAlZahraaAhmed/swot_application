import { h } from 'preact';
import { PureComponent } from 'preact-compat';

import FileOpenButton from 'components/FileOpenButton';
import { splitClasses } from 'utils/className';

import style from './style';
import itemStyle from './components/Item/style';
import linkStyle from './components/Link/style';
import { LeftItem, RightItem, Item } from './components/Item';
import Link from './components/Link';
import ObjectOfStudy from './components/ObjectOfStudy';
import MenuIcon from './components/MenuIcon';

class Menu extends PureComponent {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    onChange = event => {
        if (!event.target.files[0]) {
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            this.props.onLoad(e.target.result);
        };
        reader.readAsText(event.target.files[0]);
    };

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (
            this.wrapperRef &&
            !this.wrapperRef.contains(event.target) &&
            !this.props.isFolded
        ) {
            this.props.toggleMenu();
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render({ onSave, objectOfStudy, setObjectOfStudy, isFolded, toggleMenu }) {
        return (
            <div ref={this.setWrapperRef} className={style.menu}>
                <MenuIcon isFolded={isFolded} toggleMenu={toggleMenu} />
                <nav
                    className={splitClasses([
                        style.menu__items,
                        isFolded ? style.menu__items_folded : ''
                    ])}
                >
                    <LeftItem title="Open file">
                        <FileOpenButton
                            className={splitClasses([
                                itemStyle.item_interactable,
                                itemStyle.item_padded,
                                itemStyle.item_content
                            ])}
                            onChange={this.onChange}
                        >
                            Open
                        </FileOpenButton>
                    </LeftItem>
                    <LeftItem title="Download file">
                        <Link
                            href="#"
                            className={splitClasses([
                                itemStyle.item_interactable,
                                itemStyle.item_padded,
                                itemStyle.item_content
                            ])}
                            onClick={onSave}
                        >
                            Save
                        </Link>
                    </LeftItem>
                    <Item>
                        <ObjectOfStudy
                            value={objectOfStudy}
                            onChange={setObjectOfStudy}
                        />
                    </Item>
                    <RightItem>
                        <Link
                            href="https://htype.me"
                            tabIndex="-1"
                            target="_blank"
                            className={splitClasses([
                                linkStyle.link_legal,
                                itemStyle.item_content
                            ])}
                        >
                            Made by h_type.
                        </Link>
                    </RightItem>
                    <RightItem>
                        <Link
                            href="https://icons8.com"
                            tabIndex="-1"
                            target="_blank"
                            className={splitClasses([
                                linkStyle.link_legal,
                                itemStyle.item_content
                            ])}
                        >
                            Icons by icons8.
                        </Link>
                    </RightItem>
                </nav>
            </div>
        );
    }
}

export default Menu;
