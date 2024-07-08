import './polyfills';
import 'iframe-resizer/js/iframeResizer.contentWindow';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
