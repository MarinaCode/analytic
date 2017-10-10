import { Component, OnInit } from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService }   from '../services/authentication.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {
  isActivated: boolean;
  constructor(private indexService: IndexService, private authService: AuthenticationService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.isActivated = false;
    this.route.params.subscribe(params => {
      var id = params['id'];
      this.indexService.activateEmail(id).subscribe(result => {
        if (result.error) {
          this.router.navigate(['/index']);
        } else {
          this.isActivated = true;
          setTimeout(() => {
            this.router.navigate(['/index']);
          }, 2000)
        }
      }, err => {
        if (err.message) {
          this.router.navigate(['/index']);
        }
      })
    });
  }
}
