import { Component, OnInit } from '@angular/core';
import { SecurityService } from './../../services/security.service';

@Component({
  selector: 'kt-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  constructor(private _security:SecurityService) { }

  ngOnInit(): void {

  }

}
