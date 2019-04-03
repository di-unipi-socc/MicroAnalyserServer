import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule }    from '@angular/common/http';

//import my component
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

// Import primeNG modules
import {AccordionModule} from 'primeng/accordion';
import {MessageService} from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {ListboxModule} from 'primeng/listbox';
import {CheckboxModule} from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';
import {TreeModule } from 'primeng/primeng';
import {TreeTableModule} from 'primeng/treetable';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToolbarModule} from 'primeng/toolbar';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';
import {InputTextareaModule} from 'primeng/inputtextarea';
//import d3js component
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { GraphEditorComponent } from './graph-editor/graph-editor.component';
import { AddLinkComponent } from './add-link/add-link.component';
import { AddNodeComponent } from './add-node/add-node.component';
import { ModalRefactoringsComponent } from './modal-refactorings/modal-refactorings.component';
import { RemoveNodeComponent } from './remove-node/remove-node.component';
import { RemoveLinkComponent } from './remove-link/remove-link.component';
import { DialogAnalysisComponent } from './dialog-analysis/dialog-analysis.component';
import { DialogSmellComponent } from './dialog-smell/dialog-smell.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuEditComponent,
    GraphEditorComponent,
    AddLinkComponent,
    AddNodeComponent,
    ModalRefactoringsComponent,
    RemoveNodeComponent,
    RemoveLinkComponent,
    DialogAnalysisComponent,
    DialogSmellComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AccordionModule,
    DynamicDialogModule,
    DropdownModule,
    InputTextModule,
    SidebarModule,
    ButtonModule,
    HttpClientModule,
    ListboxModule,
    CheckboxModule,
    DialogModule,
    FileUploadModule,
    TreeModule,
    TreeTableModule,
    MessagesModule,
    MessageModule,
    ToolbarModule,
    OverlayPanelModule,
    MenuModule,
    SplitButtonModule,
    ProgressSpinnerModule,
    MenubarModule,
    PanelModule,
    InputTextareaModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ // entry componets used in DymanimcModal of PimeNg
    AddLinkComponent,
    AddNodeComponent,
    RemoveNodeComponent,
    RemoveLinkComponent,
    DialogAnalysisComponent,
    DialogSmellComponent
  ]
})
export class AppModule { }
