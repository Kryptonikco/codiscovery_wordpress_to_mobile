import React from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import axios from "axios";
import _ from "lodash";
import HTML from "react-native-render-html";

const BLOG_URL = "http://kryptonik.net/wp-json/wp/v2";

export default class App extends React.Component {
  state = {
    currentPost: null,
    posts: [
      {
        title: "Hello",
        content: "Bonjour",
        excerpt: "Bon",
        cover: require("./img/logo.png")
      },
      {
        title: "Hello 2",
        content: "Bonjour 2",
        excerpt: "Bon 2",
        cover: require("./img/logo.png")
      }
    ]
  };
  async componentDidMount() {
    const json = await axios.get(`${BLOG_URL}/posts/?_embed`);
    // alert(typeof json.data.length);
    const posts = json.data.map(jsonPost => {
      const image = _.get(
        jsonPost,
        '_embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url',
        null
      );
      const cover = image ? { uri: image } : require("./img/logo.png");
      return {
        id: jsonPost.id,
        date: jsonPost.date,
        title: jsonPost.title.rendered,
        content: jsonPost.content.rendered,
        excerpt: jsonPost.excerpt.rendered,
        cover: cover
      };
    });
    this.setState({
      posts: posts
    });
  }

  renderSummary({ item }) {
    const post = item;
    return (
      <TouchableOpacity onPress={() => this.setState({ currentPost: post })}>
        <Image style={styles.cover} source={post.cover} />
        <HTML html={post.title} />
        <HTML html={post.excerpt} />
      </TouchableOpacity>
    );
  }

  renderPost() {
    const post = this.state.currentPost;
    return (
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => this.setState({ currentPost: null })}
          >
            <Text>Back</Text>
          </TouchableOpacity>
          <Image style={styles.cover} source={post.cover} />
          <HTML html={post.title} />
          <HTML html={post.content} />
        </View>
      </ScrollView>
    );
  }

  render() {
    if (this.state.currentPost !== null) {
      return this.renderPost();
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.posts}
          renderItem={({ item }) => this.renderSummary({ item })}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  cover: {
    width: 300,
    height: 300
  }
});
