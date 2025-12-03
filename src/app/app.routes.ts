import { BussinessContentsComponent } from './layouts/components/bussiness-contents/bussiness-contents.component';
import { BussinessIntroductionComponent } from './layouts/components/bussiness-introduction/bussiness-introduction.component';
import { ContactComponent } from './layouts/components/contact/contact.component';
import { HomeComponent } from './layouts/components/home/home.component';
import { LinkComponent } from './layouts/components/link/link.component';
import { NewsComponent } from './layouts/components/news/news.component';
import { OverviewComponent } from './layouts/components/overview/overview.component';
import { PostDetailComponent } from './layouts/components/post-detail/post-detail.component';
import { SearchResultComponent } from './layouts/components/search-result/search-result.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

export const appRoutes: VexRoutes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                children: []
            },
            {
                path: 'business_introduction',
                component: BussinessIntroductionComponent,
                children: []
            },
            {
                path: 'business_contents',
                component: BussinessContentsComponent,
                children: []
            },
            {
                path: 'overview',
                component: OverviewComponent,
                children: []
            },
            {
                path: 'link',
                component: LinkComponent,
                children: []
            },
            {
                path: 'news',
                component: NewsComponent,
                children: []
            },
            {
                path: 'post-detail',
                component: PostDetailComponent,
                children: []
            },
            {
                path: 'search-result',
                component: SearchResultComponent,
                children: []
            }
        ]
    }
];
