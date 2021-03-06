import { CardActionArea, CardActions, Modal, Paper, Snackbar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import SearchIcon from '@material-ui/icons/Search';
import cartApi from 'api/cartApit';
import favoriteApi from 'api/favoriteApi';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatNumber } from 'utils/index';
import { SnackbarsNotify } from '.';
import PopupQuickView from './PopupQuickView';

const cartStyle = {
    position: 'relative',
    '&:hover, &:focus': {
        '& .MuiCardActions-root': {
            visibility: 'visible',
        },
        '& .MuiCardMedia-root': {
            transition: 'all .5s',
            transform: 'scale(1.2)',
        },
        boxShadow:
            '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
    },
};

const cardActionStyle = {
    visibility: 'hidden',
    position: 'absolute',
    top: 122,
    left: 0,
    right: 0,
    p: 0.5,
    bgcolor: 'primary.light',
    justifyContent: 'space-around',
};

const CardProduct = ({ vegetableInfo }) => {
    const { id, name, images, price, slug } = vegetableInfo;
    const formatPrice = formatNumber(price);
    const [isAlert, setIsAlert] = useState(false);
    const history = useHistory();

    const [quickView, setQuickView] = useState(false);
    const [isStatusNotify, setIsStatusNotify] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const idCurrentUser = localStorage.getItem('access_token');
    const userInfo = JSON.parse(sessionStorage.getItem('infoUser')) || {};

    const handleQuickViewOpen = () => {
        setQuickView(true);
    };
    const handleQuickViewClose = () => {
        setQuickView(false);
    };

    const handleAddToCart = async () => {
        const cartList = JSON.parse(localStorage.getItem('cartList')) || [];
        if (!idCurrentUser) setIsAlert(true);
        else {
            const valueForm = {
                userId: idCurrentUser,
                quantity: 1,
                price,
                slug,
                image: images[0],
                name,
                vegetableId: id,
            };
            let newCartList = [];
            const result = cartList.find((vegetable) => vegetable.vegetableId === id);
            if (result) {
                const newResult = {
                    ...result,
                    quantity: Number(result.quantity) + 1,
                };
                const cartRemaining = cartList.filter((info) => info.vegetableId !== id);
                newCartList = [newResult, ...cartRemaining];
            } else {
                newCartList = [valueForm, ...cartList];
            }

            localStorage.setItem('cartList', JSON.stringify(newCartList));
            if (newCartList.length > 0) {
                const total = newCartList.reduce((acc, cur) => acc + Number(cur.quantity), 0);
                localStorage.setItem('countCart', total);
            }
            toast.success(`Th??m th??nh c??ng "${name}" v??o gi??? h??ng`);

            const updateCartServer = {
                userInfo,
                list: newCartList,
            };

            await cartApi.add(updateCartServer);
        }
    };

    const handleCloseAlert = () => {
        setIsAlert(false);
    };

    const handleAddToWish = async () => {
        const favoriteList = JSON.parse(localStorage.getItem('favorite')) || [];
        if (!idCurrentUser) setIsAlert(true);
        else setIsLike(!isLike);
        if (!isLike) {
            const valueFavorite = {
                userId: idCurrentUser,
                vegetableId: id,
                name,
                price,
                slug,
                image: images[0],
            };

            const newFavoriteList = [valueFavorite, ...favoriteList];
            localStorage.setItem('favorite', JSON.stringify(newFavoriteList));
            localStorage.setItem('favoriteLength', newFavoriteList.length);
            toast.success(`Th??m th??nh c??ng "${name}" v??o danh s??ch y??u th??ch`);
            const updateFavoriteServer = {
                userInfo,
                list: newFavoriteList,
            };

            await favoriteApi.add(updateFavoriteServer);
        } else {
            const removeFavorite = favoriteList.filter((vegetable) => vegetable.vegetableId !== id);
            localStorage.setItem('favorite', JSON.stringify(removeFavorite));
            localStorage.setItem('favoriteLength', removeFavorite.length);
            toast.success(`X??a th??nh c??ng "${name}" kh???i danh s??ch y??u th??ch`);
            await favoriteApi.remove(id);
        }
    };

    useEffect(() => {
        const favoriteList = JSON.parse(localStorage.getItem('favorite')) || [];
        const like = favoriteList.filter((vegetable) => vegetable.vegetableId === id);
        if (like.length === 1) {
            setIsLike(true);
        }
    }, [id]);

    const handleClose = () => {
        setIsStatusNotify(false);
    };

    const handleRedirect = () => {
        history.push(`/products/${slug}?id=${id}`);
        const vegetableRecent = JSON.parse(sessionStorage.getItem('vegetableRecent'));
        if (!vegetableRecent) {
            sessionStorage.setItem('vegetableRecent', JSON.stringify([vegetableInfo]));
        } else {
            const newVegetable = vegetableRecent.filter((item) => item.id !== vegetableInfo.id);
            newVegetable.unshift(vegetableInfo);
            if (newVegetable.length > 4) {
                newVegetable.pop();
                sessionStorage.setItem('vegetableRecent', JSON.stringify(newVegetable));
            } else {
                sessionStorage.setItem('vegetableRecent', JSON.stringify(newVegetable));
            }
        }
    };

    return (
        <>
            <Card sx={cartStyle} onDoubleClick={() => handleAddToCart()}>
                <CardActionArea>
                    <Paper
                        square
                        sx={{
                            height: 170,
                            width: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <CardMedia
                            sx={{ height: 170, transition: 'all .5s' }}
                            image={images[0]}
                            title={name}
                        />
                    </Paper>

                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant='h6' component='h4' gutterBottom>
                            {name}
                        </Typography>
                        <Typography
                            variant='body2'
                            color='primary.light'
                            sx={{ fontWeight: 'fontWeightBold' }}
                        >
                            {formatPrice}.000 ??
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions sx={cardActionStyle}>
                    <Tooltip title='L???a ch???n c??c t??y ch???n' placement='top' arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => handleRedirect()}>
                            <FormatListBulletedIcon color='white' />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Th??m v??o danh s??ch y??u th??ch' placement='top' arrow>
                        <IconButton
                            aria-label='Th??m v??o danh s??ch y??u th??ch'
                            sx={{ color: 'common.white' }}
                            onClick={() => handleAddToWish()}
                        >
                            {isLike ? (
                                <FavoriteIcon sx={{ color: red[500] }} />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Xem nhanh' placement='top' arrow>
                        <IconButton
                            aria-label='Xem nhanh'
                            sx={{ color: 'common.white' }}
                            onMouseDown={handleQuickViewOpen}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card>

            <SnackbarsNotify isOpen={isStatusNotify} handleClose={handleClose} />

            <Modal
                open={quickView}
                onMouseUp={handleQuickViewClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                sx={{
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.5s',
                    cursor: 'pointer',
                }}
            >
                <PopupQuickView vegetableInfo={vegetableInfo} />
            </Modal>
            <Snackbar
                open={isAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={handleCloseAlert}
                message='B???n ph???i ????ng nh???p m???i s??? d???ng ???????c t??nh n??ng n??y'
            />
        </>
    );
};

CardProduct.propTypes = {
    vegetableInfo: PropTypes.object,
};

CardProduct.defaultProps = {
    vegetableInfo: {},
};

export default React.memo(CardProduct);
