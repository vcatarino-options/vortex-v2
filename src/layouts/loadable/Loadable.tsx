import React, { Suspense } from "react";
import { CircularProgress } from '@mui/material';

type ComponentType<T> = React.ComponentType<T>;

const Loadable = (Component: ComponentType<any>) => (props: any) => (
    <Suspense fallback={<CircularProgress />}>
        <Component {...props} />
    </Suspense>
);

export default Loadable;