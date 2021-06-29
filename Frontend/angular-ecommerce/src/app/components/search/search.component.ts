import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    performSearch(value: string) {
        value = (value == null ? '' : value).trim();
        
        if(value.length > 0) {
            this.router.navigateByUrl(`/search/${value}`);
        }
    }

}
