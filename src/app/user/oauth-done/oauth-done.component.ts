import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-oauth-done',
  standalone: true,
  template: '<p class="p-4">logging in...</p>'
})
export class OauthDoneComponent implements OnInit {
  ngOnInit(): void {
    const error = new URLSearchParams(window.location.search).get('error');
    window.opener?.postMessage(
      error ? { type: 'oauth-error', error } : { type: 'oauth-success' },
      window.location.origin
    );
    window.close();
  }
}
