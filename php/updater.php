<?php

const DS = DIRECTORY_SEPARATOR;
define('ROOT_DIR', dirname(rtrim(__DIR__, '/\\')) . DS);

require_once ROOT_DIR . 'php' . DS . 'Zend' . DS . 'Media' . DS . 'Id3v2.php';
require_once ROOT_DIR . 'php' . DS . 'Zend' . DS . 'Media' . DS . 'Mpeg' . DS . 'Abs.php';

/**
 * Description of Updater
 *
 * @author mindfreakthemon
 */
class Updater
{
	public static function main()
	{
		$query = isset($_GET['query']) ? $_GET['query'] : null;

		try
		{
			$updater = new Updater($_GET['library']);

			switch($query)
			{
				case 'track':

				break;
				default:
					$updater->parseTracks();
			}

		}
		catch(Exception $e)
		{
			header('X-Error: ' . $e->getMessage(), true, 404);
		}
	}

	private static $tracks_sql = <<<'SQL'
CREATE TABLE IF NOT EXISTS "tracks" (
"playtime" decimal(10,3) NOT NULL DEFAULT '0',
"playtime_string" varchar(200) DEFAULT NULL,
"bitrate" decimal(10,3) NOT NULL DEFAULT '0',
"bitrate_string" varchar(200) DEFAULT NULL,

"artist" varchar(200) NOT NULL,
"album" varchar(200) NOT NULL,
"title" varchar(200) NOT NULL,
"track_number" int(2) DEFAULT NULL,
"year" int(6) DEFAULT NULL,
"genre" varchar(80) DEFAULT NULL,
"band" varchar(200) DEFAULT NULL,
"composer" varchar(200) DEFAULT NULL,
"performer" varchar(200) DEFAULT NULL,
"rating" int(4) NOT NULL DEFAULT '0',

"location" varchar(255) NOT NULL,
"audiofile" varchar(255) NOT NULL,
"stream" int(1) NOT NULL DEFAULT '0',

"lyrics" varchar(100) DEFAULT NULL,
"cover" varchar(100) DEFAULT NULL,
"cover_mime" varchar(20) DEFAULT NULL,

"track_hash" char(32) NOT NULL,
"album_hash" char(32) NOT NULL,
"artist_hash" char(32) NOT NULL,
PRIMARY KEY ("track_hash")
);
SQL;

	private static $genres = array (
		0 => 'Blues',
		1 => 'Classic Rock',
		2 => 'Country',
		3 => 'Dance',
		4 => 'Disco',
		5 => 'Funk',
		6 => 'Grunge',
		8 => 'Jazz',
		9 => 'Metal',
		10 => 'New Age',
		11 => 'Oldies',
		12 => 'Other',
		13 => 'Pop',
		15 => 'Rap',
		16 => 'Reggae',
		17 => 'Rock',
		18 => 'Techno',
		19 => 'Industrial',
		20 => 'Alternative',
		21 => 'Ska',
		22 => 'Death Metal',
		23 => 'Pranks',
		24 => 'Soundtrack',
		26 => 'Ambient',
		28 => 'Vocal',
		30 => 'Fusion',
		31 => 'Trance',
		32 => 'Classical',
		33 => 'Instrumental',
		34 => 'Acid',
		35 => 'House',
		36 => 'Game',
		37 => 'Sound Clip',
		38 => 'Gospel',
		39 => 'Noise',
		40 => 'AlternRock',
		41 => 'Bass',
		42 => 'Soul',
		43 => 'Punk',
		44 => 'Space',
		45 => 'Meditative',
		46 => 'Instrumental Pop',
		47 => 'Instrumental Rock',
		48 => 'Ethnic',
		49 => 'Gothic',
		50 => 'Darkwave',
		52 => 'Electronic',
		54 => 'Eurodance',
		55 => 'Dream',
		56 => 'Southern Rock',
		57 => 'Comedy',
		58 => 'Cult',
		59 => 'Gangsta',
		60 => 'Top 40',
		61 => 'Christian Rap',
		63 => 'Jungle',
		64 => 'Native American',
		65 => 'Cabaret',
		66 => 'New Wave',
		67 => 'Psychadelic',
		68 => 'Rave',
		69 => 'Showtunes',
		70 => 'Trailer',
		72 => 'Tribal',
		73 => 'Acid Punk',
		74 => 'Acid Jazz',
		75 => 'Polka',
		76 => 'Retro',
		77 => 'Musical',
		79 => 'Hard Rock',
		80 => 'Folk',
		82 => 'National Folk',
		83 => 'Swing',
		84 => 'Fast Fusion',
		85 => 'Bebob',
		86 => 'Latin',
		87 => 'Revival',
		88 => 'Celtic',
		89 => 'Bluegrass',
		90 => 'Avantgarde',
		91 => 'Gothic Rock',
		92 => 'Progressive Rock',
		93 => 'Psychedelic Rock',
		94 => 'Symphonic Rock',
		95 => 'Slow Rock',
		96 => 'Big Band',
		97 => 'Chorus',
		98 => 'Easy Listening',
		99 => 'Acoustic',
		100 => 'Humour',
		101 => 'Speech',
		102 => 'Chanson',
		103 => 'Opera',
		104 => 'Chamber Music',
		105 => 'Sonata',
		106 => 'Symphony',
		107 => 'Booty Brass',
		108 => 'Primus',
		109 => 'Porn Groove',
		110 => 'Satire',
		111 => 'Slow Jam',
		112 => 'Club',
		113 => 'Tango',
		114 => 'Samba',
		115 => 'Folklore',
		116 => 'Ballad',
		117 => 'Poweer Ballad',
		118 => 'Rhytmic Soul',
		119 => 'Freestyle',
		120 => 'Duet',
		121 => 'Punk Rock',
		122 => 'Drum Solo',
		123 => 'A Capela',
		125 => 'Dance Hall',
	);

	private $libpath;
	private $library;
	private $audiopath;
	private $db;

	public function __construct($library)
	{
		require ROOT_DIR . 'libraries' . DS . $library . '.php';

		$this->audiopath = $audiopath;
		$this->library = $library;
		$this->libpath = ROOT_DIR . 'libraries' . DS . $library . DS;

		try
		{
			$this->db = new SQLite3($this->libpath . 'tracks.db', SQLITE3_OPEN_READWRITE);
		}
		catch(Exception $e)
		{
			if(!is_dir($this->libpath))
			{
				mkdir($this->libpath);
				mkdir($this->libpath . 'covers');
				mkdir($this->libpath . 'lyrics');
			}

			$this->db = new SQLite3($this->libpath . 'tracks.db', SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE);
			$this->db->exec(self::$tracks_sql);
		}
	}

	public function parseTracks()
	{
		set_time_limit(0);
		ignore_user_abort(true);

		$deleted = array();
		$modified = array();

		if(is_file($this->libpath . 'cache.php'))
			include $this->libpath . 'cache.php';
		else
			$cache = array();

		$dir = rtrim($this->audiopath, DS) . DS;

		if(!is_dir($dir))
			return;

		$dh = opendir($dir);

		if(!$dh)
			return;

		$cache_cp = $cache;

		$stack = array($dh);
		$dirstack = array('');

		while(isset($stack[0]))
		{
			$file = readdir($stack[0]);

			if($file === false)
			{
				closedir(array_shift($stack));
				array_shift($dirstack);

				continue;
			}

			$entry = $dirstack[0] . $file;

			if($file == '..' || $file == '.' || !is_readable($dir . $entry))
				continue;

			if(is_dir($dir . $entry))
			{
				$dh = opendir($dir . $entry);

				if($dh)
				{
					array_unshift($stack, $dh);
					array_unshift($dirstack, $entry . DS);
				}
			}
			else
			{
				$mtime = filemtime($dir . $entry);

				if(isset($cache[$entry]))
				{
					unset($cache_cp[$entry]);

					if($cache[$entry] == $mtime)
						continue;
				}

				$modified[] = $entry;
				$cache[$entry] = $mtime;
			}
		}

		$deleted = array_keys($cache_cp);

		foreach($deleted as $k)
			unset($cache[$k]);

		file_put_contents($this->libpath . 'cache.php', '<?php $cache = ' . var_export($cache, true) . ';');

		$this->delete($deleted);
		$this->create($modified);
	}

	private function create($modified)
	{
		$this->db->exec('BEGIN TRANSACTION');

		$escape = function($var) {
			return (is_int($var) || is_float($var)) ? $var : (is_bool($var) ? (int) $var : '\'' . $this->db->escapeString($var) . '\'');
		};

		foreach($modified as $file)
		{
			$basename = basename($file);
			$extension_pos = strrpos($basename, '.');

			if($extension_pos === false)
				continue;

			$data = array(
				'artist'=>'Unknown Artist',
				'album'=>'Unknown album',
				'title'=>'Untitled',
				'location'=>base64_encode($file),
				'audiofile'=>'/libraries/' . $this->library . '/audio/' .
				implode('/', array_map('rawurlencode', explode(DS,
						// PHP on Windows == FUUUUU~1
						stripos(PHP_OS, 'win') === 0 ? iconv('windows-1251', 'utf-8', $file) : $file
				)))
			);

			switch(strtolower(substr($basename, $extension_pos + 1)))
			{
				case 'mp3':
					try
					{
						$info = new Zend_Media_Mpeg_Abs($this->audiopath . $file);

						$data['playtime'] = $playtime = $info->getLengthEstimate();
						$data['playtime_string'] = sprintf('%d:%02d', ($playtime = ceil($playtime)) / 60, $playtime % 60);
						$data['bitrate'] = $bitrate = $info->getBitrateEstimate();
						$data['bitrate_string'] = round($bitrate) . ' kbps';
					}
					catch(Exception $e)
					{
						continue 2;
					}

					try
					{
						$id3v2 = new Zend_Media_Id3v2($this->audiopath . $file);

						if(isset($id3v2->popm))
							$data['rating'] = $id3v2->popm->rating;

						if(isset($id3v2->trck))
							$data['track_number'] = $id3v2->trck->getNumber();

						if(isset($id3v2->tpe1))
							$data['artist'] = $data['performer'] = $id3v2->tpe1->text;

						if(isset($id3v2->tpe2))
							$data['artist'] = $data['band'] = $id3v2->tpe2->text;

						if(isset($id3v2->talb))
							$data['album'] = $id3v2->talb->text;

						if(isset($id3v2->tit2))
							$data['title'] = $id3v2->tit2->text;

						if(isset($id3v2->tyer))
							$data['year'] = $id3v2->tyer->getYear();

						if(isset($id3v2->tcon))
						{
							$data['genre'] = $id3v2->tcon->text;

							$match = array();
							if(preg_match('/^\((\d+)\)$/', $data['genre'], $match) && isset(self::$genres[(int) $match[1]]))
								$data['genre'] = self::$genres[(int) $match[1]];
						}

						if(isset($id3v2->tcom))
							$data['composer'] = $id3v2->tcom->text;

						if(isset($id3v2->apic))
						{
							$cover = 'album_' . md5($id3v2->apic->imageData) . '.' . str_replace('image/', '', $id3v2->apic->mimeType);

							if(!is_file($this->libpath . 'covers' . DS . $cover))
								file_put_contents($this->libpath . 'covers' . DS . $cover, $id3v2->apic->imageData);

							$data['cover'] = '/libraries/' . $this->library . '/covers/' . $cover;
							$data['cover_mime'] = $id3v2->apic->mimeType;
						}

						if(isset($id3v2->uslt))
						{
							$lyrics = 'track_' . md5($id3v2->uslt->text) . '.txt';

							if(!is_file($this->libpath . 'lyrics' . DS . $lyrics))
								file_put_contents($this->libpath . 'lyrics' . DS . $lyrics, $id3v2->uslt->text);

							$data['lyrics'] = '/libraries/' . $this->library . '/lyrics/' . $lyrics;
						}
					}
					catch(Exception $e)
					{

					}
				break;
				case 'stream':
					$data['stream'] = true;

					$data['artist'] = 'Streams';
					$data['album'] = 'Local';
					$data['title'] = substr($basename, 0, strrpos($basename, '.'));

					$data['audiofile'] = trim(file_get_contents($this->audiopath . $file));
				break;
				default:
					continue 2;
			}

			$data['track_hash'] = md5($data['location']);
			$data['album_hash'] = md5($data['album'] . $data['artist']);
			$data['artist_hash'] = md5($data['artist']);

			$this->db->exec('INSERT OR REPLACE INTO "tracks" ("' . implode('","', array_keys($data)) . '") VALUES (' . implode(',', array_map($escape, $data)) . ')');
		}

		$this->db->exec('END TRANSACTION');
	}

	private function delete($deleted)
	{
		$this->db->exec('BEGIN TRANSACTION');

		$file = null;
		$delete_stmt = $this->db->prepare('DELETE FROM "tracks" WHERE "location" = :location');
		$delete_stmt->bindParam(':location', $file, SQLITE3_TEXT);

		foreach($deleted as $file)
		{
			$file = base64_encode($file);
			$delete_stmt->execute();
		}

		$delete_stmt->close();

		$this->db->exec('END TRANSACTION');
	}
}

Updater::main();