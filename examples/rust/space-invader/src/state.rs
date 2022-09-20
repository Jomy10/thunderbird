use thunderbird::*;
use crate::sprite::Sprite;
use crate::colors;
use quad_rand as rand;

#[derive(Default)]
pub struct State {
    player: Player,
    bullets: Vec<Bullet>,
    enemies: Vec<EnemyRow>,
    enemy_bullets: Vec<Bullet>,
    game_state: GameState,
}

impl State {
    pub fn new() -> Self {
        let mut state = State::default();
        state.enemies.push(EnemyRow::new(7, 25));
        state.enemies.push(EnemyRow::new(7, 45));
        state.enemies.push(EnemyRow::new(7, 65));
        state.game_state = GameState::Playing;
        return state;
    }

    pub fn update(&mut self) {
        match self.game_state {
            GameState::Playing => {
                let shoot = self.player.r#move();
                if shoot {
                    self.new_bullet();
                }

                // Spawn enemy bullets
                let will_shoot = rand::gen_range(0,20);
                if will_shoot == 1 && self.enemies.len() != 0 {
                    let rnd_row = rand::gen_range(0, self.enemies.len());
                    if self.enemies[rnd_row].enemies.len() != 0 {
                        let rnd_enemy = rand::gen_range(0, self.enemies[rnd_row].enemies.len());
                        self.enemy_bullets.push(Bullet {
                            pos: Vec2 {
                                x: self.enemies[rnd_row].enemies[rnd_enemy].pos.x + self.enemies[rnd_row].enemies[rnd_enemy].width / 2 - 1,
                                y: self.enemies[rnd_row].enemies[rnd_enemy].pos.y + self.enemies[rnd_row].enemies[rnd_enemy].width / 2,
                            }, speed: 3,
                            ty: BulletType::Enemy
                        });
                    }
                }

                // Move bullets
                self.bullets.retain_mut(|bullet| {
                    !bullet.r#move()
                });
                self.enemy_bullets.retain_mut(|bullet| {
                    !bullet.r#move()
                });

                // Move enemies
                self.enemies.iter_mut().for_each(|enemy_row| { enemy_row.r#move(); });

                // Collision detection
                self.bullets.retain(|bullet| {
                    let mut rm = false;
                    for row in &mut self.enemies {
                        row.enemies.retain(|enemy| {
                            let collided = bullet.collides(enemy.pos, Vec2 { x: enemy.width, y: enemy.width });
                            rm = rm || collided;
                            return !collided;
                        });
                    }
                    return !rm;
                });
                let mut player_hits = 0;
                self.enemy_bullets.retain(|bullet| {
                    let collides = bullet.collides(self.player.pos, Vec2 { x: self.player.player_width, y: self.player.player_width });
                    if collides { player_hits += 1 };
                    return !collides;
                });
                self.player.lives = self.player.lives.checked_sub(player_hits).unwrap_or(0);

                // Check win/fail condition
                if self.player.lives == 0 { self.game_state = GameState::GameOver; return; }
                let mut won = true;
                for row in &self.enemies {
                    if !row.enemies.is_empty() {
                        won = false;
                    }
                    if row.pos.y > 200 {
                        for enemy in &row.enemies {
                            if enemy.collides(self.player.pos, Vec2 { x: self.player.player_width, y: self.player.player_width }) {
                                self.game_state = GameState::GameOver;
                            }
                        }
                    }
                }
                if won { self.game_state = GameState::Won };
            }, GameState::GameOver | GameState::Won => {}
        }
    }
    pub fn draw(&self) {
        // Using unwrap here for example purpose. When this function returns an
        // error, this means the queue is full
        fill(colors::DARK_PURPLE).unwrap();
        match self.game_state {
            GameState::Playing => {
                self.bullets.iter().for_each(|bullet| { bullet.draw(); });
                self.enemy_bullets.iter().for_each(|bullet| { bullet.draw(); });
                self.player.draw();
                self.enemies.iter().for_each(|enemy_row| {
                    enemy_row.enemies.iter().for_each(|enemy| { enemy.draw(); })
                });
            }, GameState::GameOver => {

            }, GameState::Won => {}
        }
    }
    fn new_bullet(&mut self) {
        self.bullets.push(Bullet {
            pos: Vec2 {
                x: self.player.pos.x + self.player.player_width / 2 - 1,
                y: self.player.pos.y + self.player.player_width / 2,
            }, speed: 10,
            ty: BulletType::Player
        });
    }
}

enum GameState {
    Playing, GameOver, Won
}

impl Default for GameState {
    fn default() -> Self {
        return Self::Playing;
    }
}

#[derive(Clone, Copy, Debug)]
struct Vec2 {
    x: u8,
    y: u8,
}

//=========================
// Enemies
//=========================

#[derive(Debug)]
pub enum Direction {
    Left, Right
}

impl Direction {
    pub fn switch(&self) -> Self {
        match self {
            Self::Left => Self::Right,
            Self::Right => Self::Left,
        }
    }
}

#[derive(Debug)]
pub struct EnemyRow {
    enemies: Vec<Enemy>,
    speed: u8,
    size: Vec2,
    pos: Vec2,
    dir: Direction
}

impl EnemyRow {
    pub fn new(enemies: u8, y: u8) -> Self {
        let mut v = Vec::new();
        for i in 0..enemies {
            v.push(Enemy::new(10 + i * 20, y));
        }
        return EnemyRow {
            enemies: v, speed: 1,
            size: Vec2 { x: 20 * enemies, y: 20 },
            pos: Vec2 { x: 10, y: y },
            dir: Direction::Right
        };
    }

    pub fn r#move(&mut self) {
        match self.dir {
            Direction::Left => {
                self.pos.x -= self.speed;
                self.enemies.iter_mut().for_each(|enemy| {
                    enemy.pos.x = enemy.pos.x.checked_sub(self.speed).unwrap_or(255);
                });
            },
            Direction::Right => {
                self.pos.x += self.speed;
                self.enemies.iter_mut().for_each(|enemy| {
                    enemy.pos.x = enemy.pos.x.checked_add(self.speed).unwrap_or(255);
                });
            }
        }
        if self.pos.x.checked_add(self.size.x).unwrap_or(255) > (256 - 10) as u8 || self.pos.x < 10 {
            match self.dir {
                Direction::Left => { self.pos.x = 10 },
                Direction::Right => { self.pos.x = (256 - 10) as u8 - self.size.x },
            }
            self.dir = self.dir.switch();
            self.pos.y += 20;
            self.enemies.iter_mut().for_each(|enemy| {
                enemy.pos.y = self.pos.y;
            });
        }
    }
}

#[derive(Debug)]
struct Enemy {
    pos: Vec2,
    width: u8,
}

impl Enemy {
    pub fn new(x: u8, y: u8) -> Self {
        Enemy { pos: Vec2 { x, y }, width: 16}
    }

    pub fn draw(&self) {
        Sprite::Enemy.render(self.pos.x, self.pos.y);
    }
    pub fn collides(&self, opos: Vec2, osize: Vec2) -> bool {
        return self.pos.x < opos.x.checked_add(osize.x).unwrap_or(255) &&
            self.pos.x.checked_add(self.width).unwrap_or(255) > opos.x &&
            self.pos.y < opos.y.checked_add(osize.y).unwrap_or(255) &&
            self.pos.y.checked_add(self.width).unwrap_or(255) > opos.y;
    }
}

//=========================
// Bullet
//=========================

#[derive(Clone, Copy, Debug)]
enum BulletType {
    Player, Enemy
}

#[derive(Clone, Copy, Debug)]
struct Bullet {
    pos: Vec2,
    speed: u8,
    ty: BulletType,
}

impl Bullet {
    const SIZE_X: u8 = 3;
    const SIZE_Y: u8 = 6;
    fn r#move(&mut self) -> bool {
        let mut kill = false;
        match self.ty {
            BulletType::Player => self.pos.y = self.pos.y.checked_sub(self.speed).unwrap_or_else(|| { kill = true; 0 }),
            BulletType::Enemy => self.pos.y = self.pos.y.checked_add(self.speed).unwrap_or_else(|| { kill = true; 255 }),
        }
        return kill;
    }
    fn draw(&self) {
        let color = match self.ty {
            BulletType::Player => colors::YELLOW,
            BulletType::Enemy => colors::LIGHT_ORANGE,
        };
        draw_rect(self.pos.x, self.pos.y, Self::SIZE_X, Self::SIZE_Y, color).unwrap();
    }
    #[inline]
    fn collides(&self, opos: Vec2, osize: Vec2) -> bool {
        return self.pos.x < opos.x.checked_add(osize.x).unwrap_or(255) &&
            self.pos.x.checked_add(Self::SIZE_X).unwrap_or(255) > opos.x &&
            self.pos.y < opos.y.checked_add(osize.y).unwrap_or(255) &&
            self.pos.y.checked_add(Self::SIZE_Y).unwrap_or(255) > opos.y;
    }
}

//=========================
// Player
//=========================

struct Player {
    pos: Vec2,
    player_width: u8,
    speed: u8,
    cooldown: u8,
    lives: u8
}

impl Default for Player {
    fn default() -> Self {
        Self {
            pos: Vec2 { x: (256 / 2) as u8 - 5, y: (256 - 20) as u8 - 5 },
            speed: 3,
            player_width: 16,
            cooldown: 0,
            lives: 2
        }
    }
}

impl Player {
    #[inline]
    pub fn r#move(&mut self) -> bool {
        if Keys::Left.is_pressed() {
            // `checked_sub` prevents integer overflow and provides screen collision
            self.pos.x = self.pos.x.checked_sub(self.speed).unwrap_or(0);
        }
        if Keys::Right.is_pressed() {
            self.pos.x = self.pos.x.checked_add(self.speed).unwrap_or(255);
            if self.pos.x.checked_add(self.player_width).unwrap_or(255) >= 255 { self.pos.x = 255 - self.player_width }
        }
        let shoot = if self.cooldown == 0 {
            return if Keys::A.is_pressed() {
                self.cooldown += 1;
                true
            } else { false };
        } else {
            self.cooldown += 1;
            if self.cooldown == 10 { self.cooldown = 0; }
            false
        };

        return shoot;
    }
    #[inline]
    pub fn draw(&self) {
        Sprite::Player.render(self.pos.x, self.pos.y);
    }
}
