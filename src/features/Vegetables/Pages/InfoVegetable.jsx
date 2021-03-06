import { Container, Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ContentVegetable from '../components/Detail/ContentVegetable';
import DetailVegetable from '../components/Detail/DetailVegetable';
import ImageVegetable from '../components/Detail/ImageVegetable';
import FilterVegetables from '../components/FilterVegetables';
import RecentViewed from '../components/RecentViewed';
import { selectVegetableById, selectVegetableLoading, vegetableActions } from '../vegetableSlice';

const InfoVegetable = () => {
    const { search } = useLocation();
    const dispatch = useDispatch();

    const vegetableInfo = useSelector(selectVegetableById);
    const loading = useSelector(selectVegetableLoading);
    const scrollToTop = () => window.scrollTo({ top: 100, behavior: 'smooth' });

    useEffect(() => {
        const id = search.split('=')[1];
        dispatch(vegetableActions.fetchVegetableById(id));
        scrollToTop();
    }, [dispatch, search]);

    return (
        <Container maxWidth='lg'>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <FilterVegetables />
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <ImageVegetable loading={loading} imageList={vegetableInfo.images} />
                        </Grid>
                        <Grid item xs={6}>
                            <ContentVegetable
                                id={vegetableInfo.id}
                                name={vegetableInfo.name}
                                price={vegetableInfo.price}
                                weight={vegetableInfo.weight}
                                category={vegetableInfo.categoryName}
                                images={vegetableInfo.images}
                                slug={vegetableInfo.slug}
                                loading={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <DetailVegetable
                                name={vegetableInfo.name}
                                description={vegetableInfo.description}
                                weight={vegetableInfo.weight}
                                quantity={vegetableInfo.quantity}
                                viewed={vegetableInfo.viewed}
                                sold={vegetableInfo.sold}
                                loading={loading}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <RecentViewed />
                </Grid>
            </Grid>
        </Container>
    );
};

InfoVegetable.propTypes = {};

export default React.memo(InfoVegetable);
