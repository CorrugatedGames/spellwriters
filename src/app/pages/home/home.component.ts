import { Component } from '@angular/core';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'sw-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public links = [
    {
      name: 'Discord',
      link: 'https://discord.spellwritersgame.com',
      color: '#5865f2',
      currentColor: '#ccc',
      icon: 'discord',
    },
    {
      name: 'Blog',
      link: 'https://blog.spellwritersgame.com',
      color: '#e37418',
      currentColor: '#ccc',
      icon: 'blog',
    },
    {
      name: 'Reddit',
      link: 'https://reddit.spellwritersgame.com',
      color: '#fb4404',
      currentColor: '#ccc',
      icon: 'reddit',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.spellwritersgame.com',
      color: '#1da1f2',
      currentColor: '#ccc',
      icon: 'twitter',
    },
    {
      name: 'Facebook',
      link: 'https://facebook.spellwritersgame.com',
      color: '#3b5998',
      currentColor: '#ccc',
      icon: 'facebook',
    },
    {
      name: 'Email',
      link: 'mailto:support@spellwritersgame.com',
      color: '#ce00ce',
      currentColor: '#ccc',
      icon: 'email',
    },
  ];

  constructor(public metaService: MetaService) {}
}
